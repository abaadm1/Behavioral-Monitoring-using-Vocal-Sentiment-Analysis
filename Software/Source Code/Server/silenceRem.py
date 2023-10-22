import soundfile as sf
import numpy as np
import math
import logging
import numpy as np
import librosa
class SilenceDetector(object):
    def __init__(self, threshold=20, bits_per_sample=16):
        self.cur_SPL = 0
        self.threshold = threshold
        self.bits_per_sample = bits_per_sample
        self.normal = pow(2.0, bits_per_sample - 1);
        self.logger = logging.getLogger('balloon_thrift')
    def is_silence(self, chunk):
        self.cur_SPL = self.soundPressureLevel(chunk)
        is_sil = self.cur_SPL < self.threshold
        # print('cur spl=%f' % self.cur_SPL)
        if is_sil:
            self.logger.debug('cur spl=%f' % self.cur_SPL)
        return is_sil
    def soundPressureLevel(self, chunk):
        value = math.pow(self.localEnergy(chunk), 0.5)
        value = value / len(chunk) + 1e-12
        value = 20.0 * math.log(value, 10)
        return value
    def localEnergy(self, chunk):
        power = 0.0
        for i in range(len(chunk)):
            sample = chunk[i] * self.normal
            power += sample*sample
        return power
def VAD(audio, sampele_rate):
    chunk_size = int(sampele_rate*0.05) # 50ms
    index = 0
    sil_detector = SilenceDetector(15)
    nonsil_audio=[]
    while index + chunk_size < len(audio):
        if not sil_detector.is_silence(audio[index: index+chunk_size]):
            nonsil_audio.extend(audio[index: index + chunk_size])
        index += chunk_size
    return np.array(nonsil_audio)





import os


import librosa
import numpy as np


from pydub import AudioSegment
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
def set_rate(audio, rate):
    '''Set sampling rate'''
    return audio.set_frame_rate(rate)
  
def make_chunks(filename, chunk_size, sampling_rate, target_location):
    '''Divide the audio file into chunk_size samples'''
    f = AudioSegment.from_wav(filename)

    if f.frame_rate != sampling_rate:
        f = set_rate(f, sampling_rate)

    j = 0

    if not os.path.exists(target_location):
        os.makedirs(target_location)

    os.chdir(target_location)

    f_name = os.path.basename(filename)

    while len(f[:]) >= chunk_size * 1000:
        chunk = f[:chunk_size * 1000]
        chunk.export(f_name[:-4] + "_{:04d}.wav".format(j), format="wav")
        logger.info("Padded file stored as " + f_name[:-4] + "_{:04d}.wav".format(j))
        f = f[chunk_size * 1000:]
        j += 1

    # if 0 < len(f[:]) and len(f[:]) >= (chunk_size * 1000)//2:
    #     # silent = AudioSegment.silent(duration=chunk_size * 1000)
    #     paddedData = silent.overlay(f, position=0, times=1)
    #     paddedData.export(f_name[:-4] + "_{:04d}.wav".format(j), format="wav")
    #     logger.info("Padded file stored as " + f_name[:-4] + "_{:04d}.wav".format(j))
    if 0 < len(f[:]) and len(f[:]) >= (chunk_size * 1000)//2:
        chunk = f[:chunk_size * 1000]
        chunk.export(f_name[:-4] + "_{:04d}.wav".format(j), format="wav")
        logger.info("Padded file stored as " + f_name[:-4] + "_{:04d}.wav".format(j))

def rem_Silence(path):
    sr = 22050
    audio, sr = librosa.load(path, sr=sr, mono=True)
    # audio: numpy.ndarray
    print(audio.shape)
    audio = VAD(audio.flatten(), sr)
    print(audio.shape)
    new_file_name='/new_rem.wav'
    sf.write(os.path.dirname(path)+new_file_name, audio, sr)
    import wave
    import contextlib
    fname = os.path.dirname(path)+new_file_name
    with contextlib.closing(wave.open(fname,'r')) as f:
        frames = f.getnframes()
        rate = f.getframerate()
        global duration,new_path
        duration = frames / float(rate)
    if duration>4:
        new_path=os.path.dirname(path)+'/chunked_audio'
        make_chunks(os.path.dirname(path)+new_file_name,4,22050,new_path)
        return new_path
    else:
        new_path=os.path.dirname(path)+new_file_name
        return new_path
